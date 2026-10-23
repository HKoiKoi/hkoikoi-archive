import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

const HOST = "hkoikoi.dev";

type SlugInputProps = Omit<
  React.ComponentProps<typeof InputGroupInput>,
  "type"
> & {
  /** 수정할 수 없는 경로 앞부분. 예: "/blog/" */
  basePath: string;
};

/** `hkoikoi.dev/blog/` 같은 고정 접두어 뒤에 slug 만 입력받는다. */
export function SlugInput({ basePath, ...props }: SlugInputProps) {
  return (
    <InputGroup>
      <InputGroupAddon className="pr-0!">
        <InputGroupText>
          {HOST}
          {basePath}
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        className="pl-0!"
        type="text"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        {...props}
      />
    </InputGroup>
  );
}
