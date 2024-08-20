import { Spinner } from "./Spinner";

export const LoadingFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="col-lg items-center justify-center w-full">
    <div className="relative top-15">
      <Spinner size="large" inheritColor />
    </div>
    <p className="mt-30 max-w-full">{children}</p>
  </div>
);
