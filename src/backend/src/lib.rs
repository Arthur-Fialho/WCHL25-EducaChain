use candid::{CandidType, Principal};
use ic_cdk::api::caller;
use ic_cdk_macros::{query, update};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
struct Stage {
    id: u64,
    name: String,
    description: String,
    reward_amount: u64,
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
struct Student {
    principal: Principal,
    btc_address: String,
    current_stage: u64,
    completed_stages: Vec<u64>,
}

type StudentDB = HashMap<Principal, Student>;

thread_local! {
    static STUDENTS: std::cell::RefCell<StudentDB> = std::cell::RefCell::new(HashMap::new());
    static STAGES: std::cell::RefCell<Vec<Stage>> = std::cell::RefCell::new(vec![
        Stage { id: 1, name: "Introdução".to_string(), description: "Complete o módulo de introdução ao Bitcoin.".to_string(), reward_amount: 10000 },
        Stage { id: 2, name: "Módulo 1".to_string(), description: "Complete o primeiro módulo sobre chaves privadas.".to_string(), reward_amount: 15000 },
        Stage { id: 3, name: "Módulo 2".to_string(), description: "Complete o segundo módulo sobre transações.".to_string(), reward_amount: 20000 },
    ]);
}

#[update]
fn register_student(btc_address: String) {
    let caller_principal = caller();
    STUDENTS.with(|students| {
        let mut students = students.borrow_mut();
        if !students.contains_key(&caller_principal) {
            let new_student = Student {
                principal: caller_principal,
                btc_address,
                current_stage: 1,
                completed_stages: vec![],
            };
            students.insert(caller_principal, new_student);
        }
    });
}

#[query]
fn get_student_progress() -> Option<Student> {
    let caller_principal = caller();
    STUDENTS.with(|students| {
        students.borrow().get(&caller_principal).cloned()
    })
}

// Placeholder for the Bitcoin integration logic
async fn send_btc(btc_address: String, amount: u64) -> Result<String, String> {
    // This is where the actual Bitcoin transaction would be built and sent.
    // For now, we'll just simulate a success.
    ic_cdk::println!("Simulating sending {} satoshis to {}", amount, btc_address);
    Ok("tx_id_placeholder".to_string())
}

#[update]
async fn complete_stage_and_request_funds() -> Result<String, String> {
    let caller_principal = caller();
    let student = STUDENTS.with(|db| db.borrow().get(&caller_principal).cloned());

    if let Some(mut student) = student {
        let stage = STAGES.with(|s| {
            s.borrow().iter().find(|stage| stage.id == student.current_stage).cloned()
        });

        if let Some(stage) = stage {
            match send_btc(student.btc_address.clone(), stage.reward_amount).await {
                Ok(_tx_id) => {
                    student.completed_stages.push(student.current_stage);
                    let next_stage = STAGES.with(|s| s.borrow().iter().any(|s| s.id == student.current_stage + 1));
                    if next_stage {
                        student.current_stage += 1;
                    }
                    STUDENTS.with(|db| db.borrow_mut().insert(caller_principal, student));
                    Ok("Stage completed! Funds on the way.".to_string())
                }
                Err(e) => Err(format!("Failed to send BTC: {}", e)),
            }
        } else {
            Err("Current stage not found.".to_string())
        }
    } else {
        Err("Student not registered.".to_string())
    }
}

#[query]
fn get_btc_address() -> String {
    // In a real scenario, this would derive the address from the canister's principal
    "canister_btc_address_placeholder".to_string()
}

#[query]
fn donate() -> String {
    "Donation acknowledged. Thank you!".to_string()
}

// Candid export generation
ic_cdk::export_candid!();
