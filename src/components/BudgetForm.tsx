import { useState, ChangeEvent, useMemo, FormEvent } from "react";
import { useBudget } from "../hooks/useBudget";

export default function BudgetForm() {
  const [budget, setBudget] = useState(0);
  const { dispatch } = useBudget();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBudget(+e.target.value);
  };

  const isValid = useMemo(() => {
    return isNaN(budget) || budget <= 0;
  }, [budget]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch({ type: 'add-budget', payload: {budget} })
  }

  return (
    <form onSubmit={handleSubmit} action="" className="space-y-5">
      <div className="flex flex-col space-y-5">
        <label
          htmlFor="burget"
          className="text-4xl text-blue-600 font-bold text-center"
        >
          Definir Presupuesto
        </label>
        <input
          id="budget"
          type="number"
          className="w-full bg-white border border-gray-200 p-2"
          placeholder="Define tu presupuesto"
          name="budget"
          value={budget}
          onChange={handleChange}
        />
      </div>

      <input
        type="submit"
        value="Definir Presupuesto"
        className="bg-blue-600 hover:bg-blue-700 cursor-pointer w-full 
            p-2 text-white font-black uppercase disabled:opacity-40"
        disabled={isValid}
      />
    </form>
  );
}
