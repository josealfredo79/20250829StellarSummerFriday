#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test_create_and_read_record() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(CrudRecordsContract, ());
    let client = CrudRecordsContractClient::new(&env, &contract_id);

    let user = Address::generate(&env);

    // Crear un registro
    let id = client.create_record(
        &user,
        &String::from_str(&env, "Test Record"),
        &String::from_str(&env, "A test record description"),
        &1000u64,
    );

    assert_eq!(id, 1);

    // Leer el registro
    let record = client.read_record(&id).unwrap();
    assert_eq!(record.id, 1);
    assert_eq!(record.name, String::from_str(&env, "Test Record"));
    assert_eq!(record.value, 1000u64);
    assert_eq!(record.owner, user);
}

#[test]
fn test_update_record() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(CrudRecordsContract, ());
    let client = CrudRecordsContractClient::new(&env, &contract_id);

    let user = Address::generate(&env);

    // Crear un registro
    let id = client.create_record(
        &user,
        &String::from_str(&env, "Original Record"),
        &String::from_str(&env, "Original description"),
        &500u64,
    );

    // Actualizar el registro
    let success = client.update_record(
        &user,
        &id,
        &String::from_str(&env, "Updated Record"),
        &String::from_str(&env, "Updated description"),
        &1500u64,
    );

    assert!(success);

    // Verificar la actualización
    let record = client.read_record(&id).unwrap();
    assert_eq!(record.name, String::from_str(&env, "Updated Record"));
    assert_eq!(record.value, 1500u64);
}

#[test]
fn test_delete_record() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(CrudRecordsContract, ());
    let client = CrudRecordsContractClient::new(&env, &contract_id);

    let user = Address::generate(&env);

    // Crear un registro
    let id = client.create_record(
        &user,
        &String::from_str(&env, "To Delete"),
        &String::from_str(&env, "This will be deleted"),
        &100u64,
    );

    // Eliminar el registro
    let success = client.delete_record(&user, &id);
    assert!(success);

    // Verificar que se eliminó
    let record = client.read_record(&id);
    assert!(record.is_none());
}

#[test]
fn test_unauthorized_operations() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(CrudRecordsContract, ());
    let client = CrudRecordsContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let other_user = Address::generate(&env);

    // Crear un registro con el propietario
    let id = client.create_record(
        &owner,
        &String::from_str(&env, "Owner's Record"),
        &String::from_str(&env, "Only owner can modify"),
        &200u64,
    );

    // Intentar actualizar con otro usuario (debería fallar)
    let success = client.update_record(
        &other_user,
        &id,
        &String::from_str(&env, "Hacked"),
        &String::from_str(&env, "Should not work"),
        &9999u64,
    );

    assert!(!success);

    // Intentar eliminar con otro usuario (debería fallar)
    let success = client.delete_record(&other_user, &id);
    assert!(!success);
}

#[test]
fn test_list_records() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(CrudRecordsContract, ());
    let client = CrudRecordsContractClient::new(&env, &contract_id);

    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);

    // Crear varios registros
    client.create_record(
        &user1,
        &String::from_str(&env, "Record 1"),
        &String::from_str(&env, "First record"),
        &100u64,
    );

    client.create_record(
        &user2,
        &String::from_str(&env, "Record 2"),
        &String::from_str(&env, "Second record"),
        &200u64,
    );

    client.create_record(
        &user1,
        &String::from_str(&env, "Record 3"),
        &String::from_str(&env, "Third record"),
        &300u64,
    );

    // Listar todos los registros
    let all_records = client.list_records();
    assert_eq!(all_records.len(), 3);

    // Listar registros por propietario
    let user1_records = client.list_records_by_owner(&user1);
    assert_eq!(user1_records.len(), 2);

    let user2_records = client.list_records_by_owner(&user2);
    assert_eq!(user2_records.len(), 1);

    // Verificar contador
    let count = client.get_records_count();
    assert_eq!(count, 3);
}
