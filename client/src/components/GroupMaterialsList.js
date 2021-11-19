import React from 'react'

const GroupMaterialsList = ({group, materials}) => {
    const {group_id: groupId} = group
    return <React.Fragment>
        <ul>
            {materials.map((material, index) => (
                <li key={index}>
                    <MaterialListItem material={material} groupId={groupId} />
                </li>
            ))}
        </ul>
    </React.Fragment>
}


export default GroupMaterialsList;