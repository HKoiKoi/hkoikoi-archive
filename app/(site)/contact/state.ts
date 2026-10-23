export type ContactFormValues = {
  name: string;
  email: string;
  message: string;
};

export type ContactActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<keyof ContactFormValues, string[]>>;
  /** 오류 후 입력값을 유지하기 위해 되돌려준다. */
  values?: ContactFormValues;
};

export const initialContactState: ContactActionState = {
  status: "idle",
  message: "",
};
