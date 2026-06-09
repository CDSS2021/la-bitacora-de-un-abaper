---
title: "Buenas practicas ABAP: evitar SELECT dentro de LOOP"
description: Por que SELECT dentro de LOOP afecta el rendimiento y como reemplazarlo con lectura masiva de datos.
date: 2026-06-07
updatedDate: 2026-06-08
author: Cesar David Sanchez Saldana
category: Buenas practicas
tags:
  - ABAP
  - Buenas practicas
  - Performance
  - Errores comunes
draft: false
---

Uno de los problemas de performance mas comunes en ABAP es ejecutar un `SELECT` dentro de un `LOOP`. Aunque el codigo parezca simple, el impacto crece rapidamente cuando el volumen de datos aumenta.

## El problema

Cada vuelta del `LOOP` dispara una consulta a base de datos. Si la tabla interna tiene 5 registros, tal vez no se note. Si tiene 5 000, el programa puede terminar haciendo 5 000 viajes innecesarios a la base de datos.

```abap
LOOP AT lt_vbak INTO DATA(ls_vbak).
  SELECT SINGLE name1
    FROM kna1
    INTO @DATA(lv_name1)
    WHERE kunnr = @ls_vbak-kunnr.

  " Procesamiento del pedido con el nombre del cliente
ENDLOOP.
```

El patron anterior mezcla iteracion de negocio con acceso repetitivo a datos maestros. Eso dificulta optimizar, probar y razonar sobre el rendimiento.

## Alternativa: lectura masiva

Una opcion mas saludable es recolectar las claves necesarias, hacer una lectura masiva y luego consultar la tabla interna resultante.

```abap
DATA lt_kunnr TYPE SORTED TABLE OF kunnr WITH UNIQUE KEY table_line.

LOOP AT lt_vbak INTO DATA(ls_vbak_keys).
  INSERT ls_vbak_keys-kunnr INTO TABLE lt_kunnr.
ENDLOOP.

IF lt_kunnr IS NOT INITIAL.
  SELECT kunnr, name1
    FROM kna1
    INTO TABLE @DATA(lt_kna1)
    FOR ALL ENTRIES IN @lt_kunnr
    WHERE kunnr = @lt_kunnr-table_line.
ENDIF.

SORT lt_kna1 BY kunnr.

LOOP AT lt_vbak INTO DATA(ls_vbak).
  READ TABLE lt_kna1 INTO DATA(ls_kna1)
    WITH KEY kunnr = ls_vbak-kunnr
    BINARY SEARCH.

  IF sy-subrc = 0.
    " Procesamiento del pedido con ls_kna1-name1
  ENDIF.
ENDLOOP.
```

## Puntos a cuidar

- Evita ejecutar consultas repetidas cuando puedes traer los datos en bloque.
- Asegurate de que la lista de claves no este vacia antes de usar `FOR ALL ENTRIES`.
- Usa tablas internas ordenadas, hashed tables o `READ TABLE ... BINARY SEARCH` segun el caso.
- Mide con ST05, SAT o SQL Monitor cuando el escenario tenga volumen real.

## Idea clave

El objetivo no es prohibir toda consulta dentro de un ciclo de manera dogmatica. El objetivo es reconocer cuando el ciclo multiplica accesos a base de datos y reemplazarlo por una estrategia de lectura masiva y procesamiento en memoria.
