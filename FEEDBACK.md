# Feedback del Trabajo Práctico (TP2 — MongoDB)

## Integrantes

A partir de los commits del repositorio:

- **Nicolás Urdiales** (`NicolasUrdiales`)
- **Miguel Seco** (`Miguel-Seco`)
- **Bruno Tundis**

> Trabajo repartido entre los tres integrantes. 👏

---

## Resumen General

¡Muy buen trabajo! 🎉 La entrega cumple el MVP con una arquitectura clara (capas + servicios + `managers` + `utils`), modelado documental **referenciado** que aprovecha muy bien los **virtuals** de Mongoose, y —lo más importante— la **regla de los comentarios antiguos aplicada de forma idiomática y configurable**. Además resolvieron **tres bonus**: caché, seguidores y upload de imágenes.

El principal punto a ordenar es la cantidad de rutas duplicadas que hacen lo mismo; nada de fondo.

### Estado por criterio

| Criterio        | Estado | Comentario breve |
|-----------------|:------:|------------------|
| Arquitectura    |   ✅   | Capas + servicios + `catchAsync`; controladores en general delgados. |
| Modelado        |   ✅   | Referenciado con `virtuals` (comments/images); `nickName` único. |
| Validaciones    |   ✅   | Formato de `ObjectId` + validadores de body (ver Obs. 2). |
| Middlewares     |   ✅   | `validateExists(Model, campo)` / `validateId` genéricos. |
| API REST        |   ⚠️   | CRUD + relaciones completos, pero con rutas redundantes (Obs. 1). |
| Configuración   |   ✅   | `MONGO_URI`, `PORT` y `MONTHS_LIMIT` por `.env`. |
| Documentación   |   ✅   | Swagger. |

---

## Fortalezas

### 1. Regla de comentarios antiguos, idiomática y configurable ⏳
**Ubicación:** `src/services/post.service.js`, `src/services/comment.service.js`

Filtran los comentarios por antigüedad directamente en el `populate`, que es la forma idiomática en Mongo:

```js
.populate({ path: 'comments', match: { createdAt: { $gte: getFechaLimite() } }, ... })
```

Y el umbral sale del entorno (`MONTHS_LIMIT`, default 6). Se aplica tanto al traer el post como en `getCommentsByPost`. Cumple las dos condiciones del requisito. 🎯

### 2. Modelado referenciado con virtuals 🗃️
**Ubicación:** `src/models/Post.js`, `src/models/User.js`

Las relaciones inversas (imágenes y comentarios de un post; posts y comentarios de un usuario) están resueltas con **virtuals** (`ref` + `localField`/`foreignField`), lo que permite `populate` sin guardar arrays redundantes. `nickName` es único. Es un uso maduro de Mongoose.

### 3. Manejo de errores y capa de servicios 🏗️
**Ubicación:** `src/utils/catchAsync.js`, `src/services/`, `src/controllers/`

`catchAsync` envuelve los controladores para centralizar el manejo de errores async, y la lógica de datos vive en los servicios. Los controladores quedan, en general, enfocados.

### 4. Validación de `ObjectId` y existencia en middlewares ♻️
**Ubicación:** `src/middlewares/validaciones.middleware.js`

`validateId` / `validateIdParam(campo)` validan el formato del id, y `validateExists(Model, campo)` además verifica la existencia para cualquier modelo. Bien compuestos en las rutas.

### 5. Tres bonus 🌟
Caché (`CacheManager` + middleware `cache(60)` con limpieza en mutaciones), **seguidores** (`followers`/`following` + endpoints seguir/dejar de seguir) y **upload** de imágenes con `multer` (rutas de `PostImage`).

---

## Observaciones

### 1. Hay muchas rutas duplicadas que hacen lo mismo

**Estado:** ⚠️  **Severidad:** 🟡 Mejora recomendada
**Ubicación:** `src/routes/post.routes.js`, `src/routes/user.routes.js`

**Descripción:**
Conviven varias rutas equivalentes: para crear un post (`POST /`, `/create`, `/create/:userId`, `/create/:user_id`), para agregar un tag (`/:id/tag/:tagId` y `/:id/create-tag`), para seguir (`/:id/seguir/:idASeguir` y `/:id/follow/:idASeguir`) y para dejar de seguir (`/unfollow` y `/dejarSeguir`), además de `POST /` y `/create` en usuarios.

**Impacto:**
No rompe el funcionamiento, pero genera una API ambigua (¿cuál es la “oficial”?) y más superficie para mantener.

**Recomendación:**
Dejar una única ruta por acción (por ejemplo, `POST /posts` recibiendo el `user` en el body, y `POST /users/:id/follow/:targetId`). Menos rutas, más claras.

---

### 2. La validación se hace con validadores manuales en lugar de Joi

**Estado:** ⚠️  **Severidad:** 🟡 Mejora recomendada
**Ubicación:** `src/middlewares/validaciones.middleware.js`

**Descripción:**
Los cuerpos se validan con funciones propias (`validatePostBody`, `validateCommentBody`), que repiten manualmente chequeos de tipo, obligatoriedad y formato de `ObjectId`.

**Impacto:**
Funciona, pero es más verboso y propenso a inconsistencias. Para esta materia lo **recomendado** era Joi, porque corta el dato inválido antes de llegar a Mongo y evita repetir validaciones a mano (no es obligatorio; usar las validaciones de Mongoose también es válido).

**Recomendación:**
Definir schemas de Joi por entidad y aplicarlos con un middleware genérico de validación, como ya hacen con `validateExists`.

---

### 3. Algún control de existencia queda dentro del controlador

**Estado:** ⚠️  **Severidad:** 🟡 Mejora recomendada
**Ubicación:** `src/controllers/post.controller.js` (`agregarTagAPost`)

**Descripción:**
`agregarTagAPost` hace `Tag.findById` dentro del controlador; en la ruta `/:id/tag/:tagId` esa verificación ya la cubre `validateExists(Tag, 'tagId')`, pero en `/:id/create-tag` no, por lo que el chequeo quedó en el controller.

**Impacto:**
Pequeña inconsistencia con la idea de controladores de única responsabilidad.

**Recomendación:**
Unificar la verificación en el middleware para todas las rutas que agregan tags y dejar el controlador enfocado en orquestar.

---

## Conclusión

Es una entrega sólida y con buen oficio en Mongo: la regla de negocio resuelta de forma idiomática y configurable, modelado referenciado con virtuals, capa de servicios con manejo de errores prolijo, y tres bonus. 🌟

Lo principal es una limpieza de rutas y, si quieren, pasar la validación a Joi. Son ajustes de orden sobre una base muy buena. ¡Gran mejora respecto del TP anterior, felicitaciones! 🚀
