import type { Meta, StoryObj } from '@storybook/react';

import { Input } from '../../components/forms/Input';

const meta = {
  component: Input,
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    required: true,
    disabled: false,
    name: "email",
    placeholder: "Email"
  }
}

