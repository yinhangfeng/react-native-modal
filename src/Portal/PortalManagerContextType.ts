interface PortalManagerContextType {
  mount(element: React.ReactNode, zIndex?: number): number;
  update(key: number, element: React.ReactNode, zIndex?: number): void;
  unmount(key: number): void;
}

export default PortalManagerContextType;
