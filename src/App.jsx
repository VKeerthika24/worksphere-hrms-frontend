import { useEffect, useState } from "react";
import api from "./services/axios";

function App() {

    const [message, setMessage] = useState("");

    useEffect(() => {

        api.get("/health")
            .then((response) => {
                console.log(response.data);
                setMessage("Backend connected successfully!");
            })
            .catch((error) => {
                console.error(error);
                setMessage("Backend connection failed!");
            });

    }, []);

    return (
        <div className="container mt-5">

            <h1>WorkSphere HRMS</h1>

            <p className="mt-3">
                {message}
            </p>

        </div>
    );
}

export default App;