"use client"

import AssignmentPage from "../_components/assignment-page"
import { assignmentsData } from "../_data/assignment-data";
import UEEmission1Year from "./_components/UE-emission-1year"

const assMetadata = assignmentsData.filter((ass) => ass.name === "Assignment 1").at(0);

export default function Assignment1() {
    return (
        <AssignmentPage
            title={assMetadata!.name}
            shortDescription={assMetadata!.shortDescription}>
            {/* <UEEmission1Year /> */}
        </AssignmentPage>
    )
}
