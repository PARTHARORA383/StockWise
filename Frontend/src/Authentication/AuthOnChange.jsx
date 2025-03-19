import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "./firebase_config";
import { useState, useEffect } from "react";
import axios from "axios";
import { useCompany } from "../Components/Companycontext";
import { useNavigate } from "react-router-dom";

const auth = getAuth(app);

const AuthOnChange = () => {
  const [userobj, setUserObj] = useState(null);
  const { selectedCompany, setSelectedCompany } = useCompany();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const GetUserDetails = async () => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/${user.uid}/Signin`
            );

            if (response.status === 200) {
              if (selectedCompany !== response.data.user.companyid ) {
                setSelectedCompany(response.data.user.companyid);
              }
            }
            localStorage.removeItem("uid")
            localStorage.removeItem("token")
            localStorage.setItem("uid"  , JSON.stringify(user.uid))
            localStorage.setItem("token"  , JSON.stringify(user.accessToken))


            // Navigate to dashboard only if company is selected
            if (response.data.user.companyid !== selectedCompany) {
              navigate(`/Dashboard/${user.uid}/${response.data.user.companyid}`);
            }

            console.log( "this is "  + selectedCompany)
          } catch (error) {
            console.error("Error fetching user details:", error);
          }
        };

        GetUserDetails();
      } else {
        localStorage.removeItem("uid");
        navigate("/signin");
      }
    });

    return () => unsubscribe(); // Cleanup function to avoid memory leaks
  }, []); // Only trigger on auth change

  return <div></div>;
};

export default AuthOnChange;
