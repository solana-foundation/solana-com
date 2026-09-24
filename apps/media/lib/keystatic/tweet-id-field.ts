import { fields } from "@keystatic/core";
import { normalizeTweetId } from "@/lib/tweet-id";

const textField = fields.text({
  label: "Tweet URL or ID",
  description:
    "Paste an X/Twitter status URL or its numeric ID. The numeric ID is saved.",
  validation: { isRequired: true },
});

export const tweetIdField = {
  ...textField,
  validate(value: string, extra: Parameters<typeof textField.validate>[1]) {
    textField.validate(value, extra);
    const tweetId = normalizeTweetId(value);
    if (!tweetId) {
      throw new Error(
        "Enter a numeric tweet ID or a valid X/Twitter status URL.",
      );
    }
    return tweetId;
  },
  serialize(value: string) {
    return textField.serialize(normalizeTweetId(value) ?? value);
  },
};
