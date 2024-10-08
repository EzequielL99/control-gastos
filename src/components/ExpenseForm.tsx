import { ChangeEvent, FormEvent, useEffect, useState} from "react";
import type { DraftExpense, Value } from "../types";
import { categories } from "../data/categories";
import DatePicker from "react-date-picker";
import ErrorMessage from "./ErrorMessage";

import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {
  const [expense, setExpense] = useState<DraftExpense>({
    amount: 0,
    expenseName: "",
    category: "",
    date: new Date(),
  });

  const [error, setError] = useState('');

  const [previousAmount, setPreviousAmount] = useState(0);

  const { state, dispatch, remainingBudget } = useBudget();

  useEffect(() => {
    if (state.editingId) {
      const editingExpense = state.expenses.filter(currentExpense => currentExpense.id === state.editingId)[0];
      setExpense(editingExpense);
      setPreviousAmount(expense.amount);
    }
  }, [state.editingId])

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isAmountField = ['amount'].includes(name);
    setExpense({
      ...expense,
      [name]: isAmountField ? +value : value
    })


  };

  const handleChangeDate = (value: Value) => {
    setExpense({
      ...expense,
      date: value
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar
    if (Object.values(expense).includes('')) {
      setError('Todos los campos son obligatorios')
      return;
    }

    // Validar no superar el limite
    if ((expense.amount - previousAmount) > remainingBudget) {
      setError('Ese gasto supera el monto disponible')
      return;
    }
    setError('');

    // Agregar un nuevo gasto o actualizar
    if (state.editingId) {
      dispatch({ type: 'update-expense', payload: { expense: { id: state.editingId, ...expense } } })
    } else {
      dispatch({
        type: 'add-expense',
        payload: { expense }
      });
    }


    setExpense({
      amount: 0,
      expenseName: "",
      category: "",
      date: new Date(),
    });

  }

  return (
    <form className="space-y-5" action="" onSubmit={handleSubmit}>
      <legend
        className="uppercase text-center text-2xl font-black 
            border-b-2 border-blue-500 py-2"
      >
        {state.editingId ? 'Actualizar Gasto' : 'Nuevo Gasto'}
      </legend>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <div className="flex flex-col gap-2">
        <label htmlFor="expenseName" className="text-xl">
          Nombre Gasto:
        </label>
        <input
          type="text"
          id="expenseName"
          placeholder="Agrega el nombre del gasto"
          className="bg-slate-100 p-2"
          name="expenseName"
          value={expense.expenseName}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-xl">
          Cantidad:
        </label>
        <input
          type="text"
          id="amount"
          placeholder="Cantidad del gasto. Ej. 300"
          className="bg-slate-100 p-2"
          name="amount"
          value={expense.amount}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-xl">
          Categoria:
        </label>
        <select
          id="category"
          className="bg-slate-100 p-2"
          name="category"
          value={expense.category}
          onChange={handleChange}
        >
          <option value="" disabled>
            -- Seleccione --
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-xl">
          Fecha Gasto:
        </label>
        <DatePicker
          className="bg-slate-100 p-2 border-0"
          onChange={handleChangeDate}
          value={expense.date}
        />
      </div>

      <input
        type="submit"
        className="bg-blue-600 cursor-pointer w-full p-2 text-white 
                uppercase font-bold rounded-lg"
        value={state.editingId ? "Actualizar Gasto" : "Registrar Gasto"}
      />
    </form>
  );
}
