import { useEffect } from "react";
import BrandSearch from "./components/BrandSearch.jsx";
import { setUserId } from "./features/user/userSlice.js";
import { useDispatch } from "react-redux";

export function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUserId("00000000-0000-0000-0000-000000000001"));
  }, [dispatch]);

  return (
    <main className="container py-4">
      <BrandSearch />
    </main>
  );
}
