import { Children, isValidElement, PropsWithChildren } from "react";

export const CommonLayout = ({ children }: PropsWithChildren) => {
  const childrenArray = Children.toArray(children);

  const Bottom = childrenArray.find(
    (item) => isValidElement(item) && item.type === CommonLayout.Bottom,
  );
  const Content = childrenArray.find(
    (item) => isValidElement(item) && item.type === CommonLayout.Content,
  );

  const Alert = childrenArray.find(
    (item) => isValidElement(item) && item.type === CommonLayout.Alert,
  );

  return (
    <div className="common-layout-wrapper">
      <div className="content">
        {Alert}
        {Content}
      </div>
      <footer className="footer">
        {Bottom}
        <button
          style={!Bottom ? { flex: 1 } : {}}
          className="button button--secondary"
          onClick={() => {
            parent.postMessage({ pluginMessage: { type: "close" } }, "*");
          }}
        >
          Close
        </button>
      </footer>
    </div>
  );
};

const Bottom = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

const Content = ({ children }: PropsWithChildren) => {
  return <main id="main">{children}</main>;
};

const Alert = ({ message }: { message: string }) => {
  if (!message) {
    return null;
  }
  return (
    <div className="alert">
      <div className="icon icon--warning" />
      <p className="error-message">{message}</p>
    </div>
  );
};

CommonLayout.Content = Content;
CommonLayout.Bottom = Bottom;
CommonLayout.Alert = Alert;
