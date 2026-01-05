import { InspectStep } from "./InspectStep";
import { ExportStep } from "./ExportStep";
import { GlobalProvider } from "./GlobalProvider";

const App = () => {
  return (
    <GlobalProvider>
      {(step) => (
        <>
          {step === "inspect" && <InspectStep />}
          {step === "export" && <ExportStep />}
        </>
      )}
    </GlobalProvider>
  );
};

export default App;
