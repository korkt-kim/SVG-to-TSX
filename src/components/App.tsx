import { InspectStep } from "./InspectStep";
import { ExportStep } from "./ExportStep";
import { GlobalProvider } from "./GlobalProvider";
import { FigmaPersistentValueProvider } from "../libs/FigmaPersistentValue";
import { ErrorProvider } from "./ErrorProvider";
import { DoneStep } from "./DoneStep";

const App = () => {
  return (
    <FigmaPersistentValueProvider>
      <GlobalProvider>
        {(step) => (
          <ErrorProvider>
            {step === "inspect" && <InspectStep />}
            {step === "export" && <ExportStep />}
            {step === "done" && <DoneStep />}
          </ErrorProvider>
        )}
      </GlobalProvider>
    </FigmaPersistentValueProvider>
  );
};

export default App;
