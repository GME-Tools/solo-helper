import { useFirebase } from "context/FirebaseContext";

export default function HelpersList() {
  const firebase = useFirebase();

  return (
    <div className="container">
        <h4>Solo Helpers</h4>
    </div>
  )
}
