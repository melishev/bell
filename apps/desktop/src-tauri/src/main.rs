// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{CustomMenuItem, NativeImage, SystemTray, SystemTrayMenu, SystemTrayMenuItem};


fn setup_tray() -> SystemTray {
    let all_in_one = CustomMenuItem::new("all_in_one", "All-In-One")
        .native_image(NativeImage::Add);

    let cap_area = CustomMenuItem::new("cap_area", "Capture Area");

    let hide_desk_icon = CustomMenuItem::new("hide_desk_icon", "Hide Desktop Icons");

    let tray_menu = SystemTrayMenu::new()
        .add_item(all_in_one)
        .add_item(cap_area)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(hide_desk_icon);

    SystemTray::new()
        .with_menu(tray_menu)
}

fn main() {
    let tray = setup_tray();

    tauri::Builder::default()
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                event.window().hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .system_tray(tray)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
