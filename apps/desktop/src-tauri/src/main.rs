// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{SystemTray, NativeImage, CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem};

fn main() {
    let all_in_one = CustomMenuItem::new("all_in_one".to_string(), "All-In-One")
        .native_image(NativeImage::Folder);
    let cap_area = CustomMenuItem::new("cap_area".to_string(), "Capture Area");
    let hide_desk_icon = CustomMenuItem::new("hide_desk_icon".to_string(), "Hide Desktop Icons");
    let tray_menu = SystemTrayMenu::new()
        .add_item(all_in_one)
        .add_item(cap_area)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(hide_desk_icon);

    let tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(tray)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
