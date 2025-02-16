import { useParams } from "react-router-dom";
import Seat from "../../components/Seat/Seat";

function Widget() {
  const { sessionId, hallId } = useParams();

  return (
    <div>
      <Seat sessionId={sessionId} hallId={hallId} />
    </div>
  );
}

export default Widget;