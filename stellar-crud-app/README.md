# Stellar CRUD Application

Una aplicación web completa que implementa operaciones CRUD (Create, Read, Update, Delete) utilizando un contrato inteligente Soroban en la blockchain de Stellar, con una interfaz moderna en Next.js.

## 🚀 Características

### Smart Contract (Soroban)
- ✅ Operaciones CRUD completas
- ✅ Autorización basada en propietario
- ✅ Tests unitarios
- ✅ Desplegado en Testnet

### Frontend (Next.js)
- ✅ Interfaz moderna con Tailwind CSS
- ✅ Integración con Freighter Wallet
- ✅ Gestión de estado con Zustand
- ✅ Validación de formularios con Zod
- ✅ Notificaciones toast
- ✅ Diseño responsive

## 📋 Información del Contrato

- **Contrato ID**: `CDGZVMBSHNJ4JYESI32MUANDBNW5NM2ASUY6FOONND3WHJYPNYMV6BNJ`
- **Red**: Stellar Testnet
- **Hash WASM**: `98ea3c7031382c9a7e5497f499e20f023834a0e88fa2144c8f4df204ba5a9ffc`

### Enlaces del Contrato
- [Ver en Stellar Expert](https://stellar.expert/explorer/testnet/contract/CDGZVMBSHNJ4JYESI32MUANDBNW5NM2ASUY6FOONND3WHJYPNYMV6BNJ)

## 🛠️ Instalación y Desarrollo

### Prerequisitos
- Node.js 18+ 
- Stellar CLI
- Extensión Freighter Wallet

### Configuración del Proyecto

1. **Clonar el repositorio**
```bash
git clone [repository-url]
cd stellar-crud-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:3000
```

## 🔧 Estructura del Proyecto

```
stellar-crud-app/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # Componentes React
│   │   ├── WalletConnector.tsx
│   │   ├── RecordForm.tsx
│   │   ├── RecordList.tsx
│   │   ├── RecordCard.tsx
│   │   └── DeleteConfirmationModal.tsx
│   ├── hooks/               # Hooks personalizados
│   │   ├── useNotifications.ts
│   │   └── useRecordForm.ts
│   ├── store/               # Estados Zustand
│   │   ├── wallet.ts
│   │   └── records.ts
│   └── types/               # Definiciones TypeScript
│       └── index.ts
├── contratosEjemplo/
│   └── crud-records/        # Smart Contract Soroban
└── README.md
```

## 📱 Uso de la Aplicación

### 1. Conectar Wallet
- Instala la extensión Freighter
- Haz clic en "Conectar Freighter"
- Autoriza la conexión

### 2. Gestionar Registros
- **Crear**: Haz clic en "Nuevo Registro"
- **Leer**: Los registros se muestran automáticamente
- **Editar**: Haz clic en el icono de editar (solo tus registros)
- **Eliminar**: Haz clic en el icono de eliminar (solo tus registros)

### 3. Filtros y Búsqueda
- Busca por nombre o descripción
- Filtra entre "Todos" los registros o "Mis Registros"

## 🧪 Smart Contract

### Compilar el Contrato
```bash
cd contratosEjemplo/crud-records/contracts/crud-records
make build
```

### Ejecutar Tests
```bash
make test
```

### Desplegar a Testnet
```bash
stellar contract deploy --wasm target/wasm32v1-none/release/crud_records.wasm --source [tu-identidad] --network testnet
```

## 🔗 Métodos del Contrato

- `create_record(caller, name, description, value) -> u32`
- `read_record(id) -> Option<Record>`
- `update_record(caller, id, name, description, value) -> bool`
- `delete_record(caller, id) -> bool`
- `list_records() -> Vec<Record>`
- `list_records_by_owner(owner) -> Vec<Record>`
- `get_records_count() -> u32`

## 🎨 Tecnologías Utilizadas

### Frontend
- **Next.js 15** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Zustand** - Gestión de estado
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Sonner** - Notificaciones toast
- **Lucide React** - Iconos

### Blockchain
- **Stellar SDK** - Interacción con blockchain
- **Soroban** - Smart contracts
- **Freighter Wallet** - Wallet del navegador

## 🐛 Solución de Problemas

### Errores Comunes

1. **Freighter no detectado**
   - Asegúrate de tener la extensión instalada
   - Refresca la página

2. **Error de conexión**
   - Verifica que estés en Testnet
   - Asegúrate de tener fondos de testnet

3. **Transacción fallida**
   - Verifica que tengas suficiente XLM para fees
   - Intenta nuevamente

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Para soporte y preguntas, abre un issue en el repositorio.
