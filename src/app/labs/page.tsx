import { getAllLabs } from "@/lib/labs";
import LabsClient from "./LabsClient";

export default function LabsPage() {
  const labs = getAllLabs();
  return <LabsClient labs={labs} />;
}
