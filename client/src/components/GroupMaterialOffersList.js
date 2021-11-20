import React from "react";
import MaterialOfferListItem from "./MaterialOfferListItem";

const GroupMaterialOffersList = ({ group, materials }) => {
  //const { group_id: groupId } = group;
  return (
    <React.Fragment>
      <ul>
        {materials.map((material) => (
          <li key={material._id}>
            <MaterialOfferListItem material={material} groupId={group} />
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
};

export default GroupMaterialOffersList;
