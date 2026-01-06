import { InspectStep } from "./InspectStep";
import { ExportStep } from "./ExportStep";
import { GlobalProvider } from "./GlobalProvider";
import { FigmaPersistentValueProvider } from "../libs/FigmaPersistentValue";

const App = () => {
  return (
    <FigmaPersistentValueProvider>
      <GlobalProvider>
        {(step) => (
          <>
            {step === "inspect" && <InspectStep />}
            {step === "export" && <ExportStep />}
          </>
        )}
      </GlobalProvider>
    </FigmaPersistentValueProvider>
  );
};

export default App;
