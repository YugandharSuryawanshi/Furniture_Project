declare module '@coreui/coreui' {
    export class Sidebar {
        static getOrCreateInstance(element: Element): Sidebar;
        toggle(): void;
    }
}
