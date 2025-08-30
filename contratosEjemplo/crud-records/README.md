# CRUD Records Contract

Un contrato inteligente Soroban que implementa operaciones CRUD (Create, Read, Update, Delete) para gestionar registros.

## Funcionalidades

### Operaciones CRUD
- **Create**: Crear nuevos registros con ID único
- **Read**: Leer registros por ID
- **Update**: Actualizar registros existentes (solo el propietario)
- **Delete**: Eliminar registros (solo el propietario)
- **List**: Listar todos los registros o filtrar por propietario

### Estructura de Datos
```rust
pub struct Record {
    pub id: u32,           // ID único del registro
    pub name: String,      // Nombre del registro
    pub description: String, // Descripción detallada
    pub value: u64,        // Valor numérico asociado
    pub owner: Address,    // Dirección del propietario
    pub created_at: u64,   // Timestamp de creación
    pub updated_at: u64,   // Timestamp de última actualización
}
```

## Métodos Públicos

### `create_record(caller: Address, name: String, description: String, value: u64) -> u32`
Crea un nuevo registro y devuelve su ID único.

### `read_record(id: u32) -> Option<Record>`
Obtiene un registro por su ID.

### `update_record(caller: Address, id: u32, name: String, description: String, value: u64) -> bool`
Actualiza un registro existente. Solo el propietario puede modificarlo.

### `delete_record(caller: Address, id: u32) -> bool`
Elimina un registro. Solo el propietario puede eliminarlo.

### `list_records() -> Vec<Record>`
Obtiene todos los registros almacenados.

### `list_records_by_owner(owner: Address) -> Vec<Record>`
Obtiene todos los registros de un propietario específico.

### `get_records_count() -> u32`
Obtiene el número total de registros.

## Compilación

```bash
make build
```

## Pruebas

```bash
make test
```

## Seguridad

- Solo el propietario de un registro puede modificarlo o eliminarlo
- Todas las operaciones de escritura requieren autenticación del caller
- Los IDs son únicos y se generan automáticamente
- Los timestamps se registran automáticamente

## Uso con Frontend

Este contrato está diseñado para trabajar con una aplicación frontend que permita:
- Conectar wallets (Freighter)
- Crear y gestionar registros
- Visualizar listas de registros
- Búsqueda y filtrado
