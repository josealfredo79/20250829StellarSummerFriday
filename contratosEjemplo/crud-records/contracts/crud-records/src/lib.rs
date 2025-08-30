#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, log, Env, Address, String, Vec};

#[derive(Clone)]
#[contracttype]
pub struct Record {
    pub id: u32,
    pub name: String,
    pub description: String,
    pub value: u64,
    pub owner: Address,
    pub created_at: u64,
    pub updated_at: u64,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Record(u32),
    Counter,
    RecordsList,
}

#[contract]
pub struct CrudRecordsContract;

#[contractimpl]
impl CrudRecordsContract {
    /// Crear un nuevo registro
    pub fn create_record(
        env: Env,
        caller: Address,
        name: String,
        description: String,
        value: u64,
    ) -> u32 {
        caller.require_auth();

        let id = Self::get_next_id(&env);
        let current_time = env.ledger().timestamp();

        let record = Record {
            id,
            name: name.clone(),
            description: description.clone(),
            value,
            owner: caller.clone(),
            created_at: current_time,
            updated_at: current_time,
        };

        // Guardar el registro
        env.storage().persistent().set(&DataKey::Record(id), &record);

        // Actualizar la lista de IDs
        let mut records_list: Vec<u32> = env
            .storage()
            .persistent()
            .get(&DataKey::RecordsList)
            .unwrap_or(Vec::new(&env));
        
        records_list.push_back(id);
        env.storage().persistent().set(&DataKey::RecordsList, &records_list);

        log!(
            &env,
            "Record created: id={}, name={}, owner={}",
            id,
            name,
            caller
        );

        id
    }

    /// Leer un registro por ID
    pub fn read_record(env: Env, id: u32) -> Option<Record> {
        env.storage().persistent().get(&DataKey::Record(id))
    }

    /// Actualizar un registro existente
    pub fn update_record(
        env: Env,
        caller: Address,
        id: u32,
        name: String,
        description: String,
        value: u64,
    ) -> bool {
        caller.require_auth();

        if let Some(mut record) = env.storage().persistent().get::<DataKey, Record>(&DataKey::Record(id)) {
            // Verificar que el caller sea el propietario
            if record.owner != caller {
                log!(&env, "Unauthorized: caller is not the owner");
                return false;
            }

            // Actualizar campos
            record.name = name.clone();
            record.description = description.clone();
            record.value = value;
            record.updated_at = env.ledger().timestamp();

            // Guardar cambios
            env.storage().persistent().set(&DataKey::Record(id), &record);

            log!(
                &env,
                "Record updated: id={}, name={}, owner={}",
                id,
                name,
                caller
            );

            true
        } else {
            log!(&env, "Record not found: id={}", id);
            false
        }
    }

    /// Eliminar un registro
    pub fn delete_record(env: Env, caller: Address, id: u32) -> bool {
        caller.require_auth();

        if let Some(record) = env.storage().persistent().get::<DataKey, Record>(&DataKey::Record(id)) {
            // Verificar que el caller sea el propietario
            if record.owner != caller {
                log!(&env, "Unauthorized: caller is not the owner");
                return false;
            }

            // Eliminar el registro
            env.storage().persistent().remove(&DataKey::Record(id));

            // Remover de la lista
            let records_list: Vec<u32> = env
                .storage()
                .persistent()
                .get(&DataKey::RecordsList)
                .unwrap_or(Vec::new(&env));

            let mut new_list = Vec::new(&env);
            for record_id in records_list.iter() {
                if record_id != id {
                    new_list.push_back(record_id);
                }
            }
            env.storage().persistent().set(&DataKey::RecordsList, &new_list);

            log!(&env, "Record deleted: id={}, owner={}", id, caller);

            true
        } else {
            log!(&env, "Record not found: id={}", id);
            false
        }
    }

    /// Listar todos los registros
    pub fn list_records(env: Env) -> Vec<Record> {
        let records_list: Vec<u32> = env
            .storage()
            .persistent()
            .get(&DataKey::RecordsList)
            .unwrap_or(Vec::new(&env));

        let mut result = Vec::new(&env);
        
        for id in records_list.iter() {
            if let Some(record) = env.storage().persistent().get::<DataKey, Record>(&DataKey::Record(id)) {
                result.push_back(record);
            }
        }

        result
    }

    /// Listar registros de un propietario específico
    pub fn list_records_by_owner(env: Env, owner: Address) -> Vec<Record> {
        let records_list: Vec<u32> = env
            .storage()
            .persistent()
            .get(&DataKey::RecordsList)
            .unwrap_or(Vec::new(&env));

        let mut result = Vec::new(&env);
        
        for id in records_list.iter() {
            if let Some(record) = env.storage().persistent().get::<DataKey, Record>(&DataKey::Record(id)) {
                if record.owner == owner {
                    result.push_back(record);
                }
            }
        }

        result
    }

    /// Obtener el total de registros
    pub fn get_records_count(env: Env) -> u32 {
        let records_list: Vec<u32> = env
            .storage()
            .persistent()
            .get(&DataKey::RecordsList)
            .unwrap_or(Vec::new(&env));

        records_list.len()
    }

    /// Función helper para obtener el siguiente ID
    fn get_next_id(env: &Env) -> u32 {
        let current_counter: u32 = env
            .storage()
            .persistent()
            .get(&DataKey::Counter)
            .unwrap_or(0);
        
        let next_id = current_counter + 1;
        env.storage().persistent().set(&DataKey::Counter, &next_id);
        
        next_id
    }
}

mod test;
