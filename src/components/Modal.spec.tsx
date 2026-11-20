import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Modal } from "./Modal.js";

// Casos traídos de project-admin (src/components/ui/Modal.spec.tsx): el admin
// los fija para su modal y aquí quedan como contrato del modal compartido.
describe("Modal", () => {
  it("un modal alto se desplaza con el fondo y mantiene la cabecera a la vista", () => {
    render(
      <Modal open onClose={vi.fn()} title="Importar libro">
        <div style={{ height: 5000 }}>Vista previa larga</div>
      </Modal>,
    );

    const overlay = document.querySelector("[data-modal-overlay]")!;
    expect(overlay.className).toContain("overflow-y-auto");
    const header = screen.getByRole("heading", { name: "Importar libro" }).parentElement!;
    expect(header.className).toContain("sticky");
    expect(screen.getByRole("dialog", { name: "Importar libro" })).toBeTruthy();
  });

  it("se cierra con su botón", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Procesos">
        contenido
      </Modal>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("se cierra con Esc", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Procesos">
        contenido
      </Modal>,
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("con dos modales abiertos, Esc cierra solo el de arriba", () => {
    const outer = vi.fn();
    const inner = vi.fn();
    render(
      <>
        <Modal open onClose={outer} title="Menú de plantilla">
          menú
        </Modal>
        <Modal open onClose={inner} title="Elegir ítem">
          selector
        </Modal>
      </>,
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(inner).toHaveBeenCalledTimes(1);
    expect(outer).not.toHaveBeenCalled();
  });

  it("deja Esc a quien ya lo usó dentro, como un autocompletado", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Editar fórmula">
        <input
          aria-label="Fórmula"
          onKeyDown={(event) => event.key === "Escape" && event.preventDefault()}
        />
      </Modal>,
    );

    fireEvent.keyDown(screen.getByLabelText("Fórmula"), { key: "Escape" });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("cerrado no hace nada", () => {
    const onClose = vi.fn();
    render(
      <Modal open={false} onClose={onClose} title="Procesos">
        contenido
      </Modal>,
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("pulsar fuera lo cierra; pulsar dentro, no", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Procesos">
        <button type="button">Dentro</button>
      </Modal>,
    );

    fireEvent.mouseDown(screen.getByRole("button", { name: "Dentro" }));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.mouseDown(document.querySelector("[data-modal-overlay]")!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("con dismissable={false} pulsar fuera no lo cierra", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Agregar accesorio" dismissable={false}>
        pasos
      </Modal>,
    );

    fireEvent.mouseDown(document.querySelector("[data-modal-overlay]")!);

    expect(onClose).not.toHaveBeenCalled();
  });
});
