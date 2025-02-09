import { useParams } from "react-router-dom";
import Seat from "../../components/Seat/Seat";

function Widget() {
  const { sessionId, hallId } = useParams();

  console.log("Session ID:", sessionId); // Перевірка sessionId
  console.log("Hall ID:", hallId); // Перевірка hallId

  return (
    <div>
      <Seat sessionId={sessionId} hallId={hallId} />
    </div>
  );
}

export default Widget;