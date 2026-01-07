import { InspectStep } from "./InspectStep";
import { ExportStep } from "./ExportStep";
import { GlobalProvider } from "./GlobalProvider";
import { FigmaPersistentValueProvider } from "../libs/FigmaPersistentValue";
import { DoneStep } from "./DoneStep";

const App = () => {
  return (
    <FigmaPersistentValueProvider>
      <GlobalProvider>
        {(step) => (
          <>
            {step === "inspect" && <InspectStep />}
            {step === "export" && <ExportStep />}
            {step === "done" && <DoneStep />}
          </>
        )}
      </GlobalProvider>
    </FigmaPersistentValueProvider>
  );
};

export default App;
