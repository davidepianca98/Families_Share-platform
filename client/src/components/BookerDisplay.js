import React, { useEffect, useState } from "react";
import axios from "axios";
import Log from "./Log";

const getUserProfile = (userId) => {
  return axios
    .get(`/api/users/${userId}/profile`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return {
        given_name: "",
        family_name: "",
        image: { path: "/images/profiles/user_default_photo.png" },
        address: { street: "", number: "" },
        email: "",
        phone: "",
        phone_type: "",
        visible: false,
        user_id: "",
      };
    });
};

const BookerDisplay = (props) => {
  const { bookerId } = props;
  const [user, setUser] = useState({
    image: { path: "" },
    given_name: "",
    family_name: "",
  });

  useEffect(() => {
    async function fetchUser() {
      const fetchedUser = await getUserProfile(bookerId);
      setUser(fetchedUser);
    }
    fetchUser();
  }, [bookerId]);

  return (
    <div className="row no-gutters" style={{ minHeight: "5rem" }}>
      <div className="col-1-10">
        <img
          style={{
            width: "3rem",
            height: "3rem",
            borderRadius: "3.2rem",
          }}
          src={user.image.path}
          alt="avatar"
        />
      </div>
      <div className="col-9-10">
        <div
          className="materialInfoDescription"
          style={{ paddingLeft: "1rem" }}
        >
          {user.given_name} {user.family_name}
        </div>
      </div>
    </div>
  );
};

export default BookerDisplay;
