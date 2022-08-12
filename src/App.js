import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

function App() {
  const {
    loginWithPopup,
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  function callApi() {
    axios
      .get("http://localhost:4000/")
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err.message));
  }

  async function callProtectedApi() {
    try {
      const token = await getAccessTokenSilently();
      const resopnse = await axios.get("http://localhost:4000/protected", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log(resopnse.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="bg-gray-300 min-h-screen p-6 flex align-center justify-center flex-col">
      <div className="flex flex-col mx-auto child:mb-2">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-60" onClick={loginWithPopup}>Login with Popup</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-60" onClick={loginWithRedirect}>Login with Redirect</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-60" onClick={logout}>Logout</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-60" onClick={callApi}>Call API Route</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-60" onClick={callProtectedApi}>Call Protected API Route</button>
      </div>

      <h3 className="flex align-center justify-center text-3xl text-purple-500" >User is {isAuthenticated ? "Logged in" : "Not logged in"}</h3>
      {isAuthenticated && (
        <pre className="bg-red-300 w-min mar mx-auto mt-5">
          {" "}
          {JSON.stringify(user, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;
