import { Children, isValidElement, PropsWithChildren } from "react";

export const CommonLayout = ({ children }: PropsWithChildren) => {
  const childrenArray = Children.toArray(children);

  const Bottom = childrenArray.find(
    (item) => isValidElement(item) && item.type === CommonLayout.Bottom,
  );
  const Content = childrenArray.find(
    (item) => isValidElement(item) && item.type === CommonLayout.Content,
  );

  return (
    <div className="common-layout-wrapper">
      <div className="content">{Content}</div>
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

CommonLayout.Content = Content;
CommonLayout.Bottom = Bottom;
