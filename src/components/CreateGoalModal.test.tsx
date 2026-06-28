import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CreateGoalModal } from "./CreateGoalModal";

describe("CreateGoalModal", () => {
  it("renders all form fields", () => {
    render(<CreateGoalModal onSubmit={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByLabelText(/hedef adı/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hedef tutar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hedef tarih/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/stellar adresi/i)).toBeInTheDocument();
  });

  it("calls onSubmit with correct data on valid submit", () => {
    const onSubmit = vi.fn();
    render(<CreateGoalModal onSubmit={onSubmit} onClose={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/hedef adı/i), {
      target: { value: "Laptop" },
    });
    fireEvent.change(screen.getByLabelText(/hedef tutar/i), {
      target: { value: "500" },
    });
    fireEvent.change(screen.getByLabelText(/hedef tarih/i), {
      target: { value: "2026-12-31" },
    });
    fireEvent.change(screen.getByLabelText(/stellar adresi/i), {
      target: { value: "GABC" },
    });
    fireEvent.click(screen.getByRole("button", { name: /oluştur/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Laptop",
      targetAmount: 500,
      targetDate: "2026-12-31",
      destinationAddress: "GABC",
    });
  });

  it("does not submit when required fields are empty", () => {
    const onSubmit = vi.fn();
    render(<CreateGoalModal onSubmit={onSubmit} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /oluştur/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onClose when cancel clicked", () => {
    const onClose = vi.fn();
    render(<CreateGoalModal onSubmit={vi.fn()} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "İptal" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
