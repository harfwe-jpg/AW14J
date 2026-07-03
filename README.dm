# 🚗 Sistema de Cámara de Multas Viales

Aplicación moderna, funcional y lista para usar para la gestión de infracciones de tránsito.

## 📦 Archivos Incluidos

### 1. **index.html** ⭐ (COMIENZA AQUÍ)

- Versión standalone completa de la aplicación
- **NO requiere instalación**
- Abre directamente en cualquier navegador
- Almacenamiento local (localStorage)
- Interfaz moderna con diseño industrial

**Cómo usar:**

```bash
# Opción 1: Doble click en el archivo
# Opción 2: Con servidor local
python -m http.server 8000
# Luego abre en navegador: http://localhost:8000/index.html
```

### 2. **camera_multas.jsx**

- Componente React puro
- Para proyectos React existentes
- Requiere: `npm install lucide-react`
- Usa localStorage para persistencia

**Cómo usar:**

```bash
# En tu proyecto React
npm install lucide-react
# Copiar archivo a src/components/
# Importar: import CameraMultas from './components/camera_multas'
```

### 3. **backend_app.py** 🔧

- Servidor API completo en Flask
- Base de datos JSON (escalable a SQL)
- Endpoints RESTful
- CORS habilitado

**Cómo usar:**

```bash
pip install -r requirements.txt
python backend_app.py
# Accede a: http://localhost:5000
```

### 4. **requirements.txt**

- Dependencias Python necesarias
- Incluye comentarios para librerías opcionales

### 5. **.env.example**

- Plantilla de variables de entorno
- Copiar a `.env` antes de ejecutar
- Contiene configuraciones sensibles

### 6. **GUIA_COMPLETA.md** 📚

- Documentación extensiva (300+ líneas)
- Instalación paso a paso
- Referencia completa de API
- Ejemplos de uso
- Troubleshooting
- Mejoras de seguridad
- Despliegue en producción

-----

## 🚀 Inicio Rápido

### Opción 1: Solo Frontend (Más Simple)

```bash
# Descargar o crear index.html
# Abrir en navegador directamente
# ¡Listo! Funciona sin instalación
```

### Opción 2: Frontend + Backend (Completo)

```bash
# Terminal 1: Backend
pip install -r requirements.txt
python backend_app.py

# Terminal 2: Frontend
python -m http.server 8000

# Navegador: http://localhost:8000/index.html
```

### Opción 3: Proyecto React

```bash
# En tu proyecto React
npm install lucide-react
# Copiar camera_multas.jsx
# Importar y usar en tu app
```

-----

## ✨ Características

- ✅ Captura de infracciones con placa, tipo y detalles
- ✅ Cálculo automático de multas según tipo
- ✅ Historial completo con búsqueda
- ✅ Exportación a JSON
- ✅ Estadísticas en tiempo real
- ✅ Modal de detalles
- ✅ Diseño moderno industrial
- ✅ Responsive (funciona en móviles)
- ✅ Almacenamiento persistente
- ✅ Sin dependencias (HTML puro)

-----

## 📊 Estructura de Datos

```json
{
  "id": 1717942800000,
  "fecha": "2024-06-09T15:30:00",
  "placa": "ABC-1234",
  "tipo": "exceso-velocidad",
  "velocidad": 85,
  "limite_velocidad": 60,
  "monto": 2500,
  "estado": "pendiente"
}
```

-----

## 🔌 API Endpoints (Backend)

```
GET    /api/infracciones              → Obtener todas
POST   /api/infracciones              → Crear nueva
GET    /api/infracciones/<id>         → Obtener por ID
PUT    /api/infracciones/<id>         → Actualizar
DELETE /api/infracciones/<id>         → Eliminar
GET    /api/estadisticas              → Ver estadísticas
POST   /api/infracciones/filtrar      → Filtrar
GET    /api/exportar/json             → Exportar datos
GET    /api/salud                     → Verificar estado
```

-----

## 💵 Tarifas de Multas (Configurables)

|Infracción       |Monto Base|
|-----------------|----------|
|Exceso 1-10 km/h |$500      |
|Exceso 11-20 km/h|$1,000    |
|Exceso 21-30 km/h|$2,500    |
|Exceso +30 km/h  |$5,000    |
|Estacionamiento  |$1,500    |
|Semáforo en Rojo |$3,000    |
|Uso de Celular   |$2,000    |
|Sin Cinturón     |$1,000    |

-----

## 🎨 Diseño

- **Tema**: Industrial Moderno
- **Colores**: Negro/Azul oscuro + Rojo/Naranja
- **Tipografía**: JetBrains Mono (monoespaciada)
- **Animaciones**: CSS puras
- **Responsive**: Mobile-first

-----

## 🔒 Seguridad (Recomendaciones)

Para producción, implementar:

- ✅ Autenticación JWT
- ✅ Validación de datos con Marshmallow
- ✅ Rate limiting
- ✅ Base de datos SQL (PostgreSQL/MySQL)
- ✅ HTTPS/SSL
- ✅ Logs y auditoría

Ver `GUIA_COMPLETA.md` para más detalles.

-----

## 📱 Compatibilidad

- ✅ Chrome/Edge (últimas versiones)
- ✅ Firefox (últimas versiones)
- ✅ Safari (últimas versiones)
- ✅ Móviles iOS/Android
- ✅ Tablets

-----

## 🐛 Troubleshooting

### “El archivo HTML no funciona”

→ Asegurate de abrir con `http://` no `file://`
→ Usa: `python -m http.server 8000`

### “El backend no inicia”

→ Instala dependencias: `pip install -r requirements.txt`
→ Puerto 5000 ocupado: `lsof -i :5000`

### “CORS error”

→ El backend debe estar ejecutando
→ Verifica URL en requests

-----

## 📚 Documentación

- **GUIA_COMPLETA.md** - Documentación exhaustiva
- **inline comments** - En el código fuente
- **API docs** - Ejemplos en GUIA_COMPLETA.md

-----

## 🚀 Próximas Mejoras

- [ ] Integración con cámaras IP
- [ ] Reconocimiento OCR de placas
- [ ] Almacenamiento de fotos
- [ ] Geolocalización
- [ ] Dashboard analítico
- [ ] Pagos en línea
- [ ] Notificaciones SMS/Email
- [ ] Autenticación de usuarios

-----

## 📄 Licencia

Proyecto educativo y administrativo.
Cumplir con regulaciones locales de tránsito.

-----

## ✅ Checklist de Inicio

- [ ] Descargar archivos
- [ ] Abrir `index.html` en navegador
- [ ] Crear una infracción de prueba
- [ ] Verificar exportación JSON
- [ ] (Opcional) Ejecutar backend Python
- [ ] (Opcional) Ver documentación completa

-----

## 📞 Soporte

Para dudas, revisa:

1. GUIA_COMPLETA.md
1. Comentarios en el código
1. Sección Troubleshooting

-----

**¡Tu sistema de cámara de multas está listo! 🎉**

**Versión:** 1.0.0
**Última actualización:** 2024
