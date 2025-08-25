import { Dispatch, SetStateAction } from "react";
import { Button } from "./button";
import { Input } from "./input";

interface IColorPicker {
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
}

export default function ColorPicker({ color, setColor }: IColorPicker) {
  // Generate random hex color
  const getRandomColor = () => {
    const random = Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0");
    return `#${random}`;
  };

  const handleRandomColor = () => {
    const newColor = getRandomColor();
    setColor(newColor);
  };

  return (
    <>
      <div className="relative">
        {/* Hex input */}
        <Input
          type="text"
          value={color}
          name="color"
          onChange={(e) => setColor(e.target.value)}
          placeholder="Hexcode"
          className="w-full pl-12 pr-3 py-2 border border-gray-300"
        />

        {/* Circular color preview & picker */}
        <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-6 h-6 rounded-full border-none p-0 m-0 cursor-pointer opacity-0 absolute"
          />
          {/* Visible circle showing color */}
          <div
            className="w-6 h-6 rounded-full border border-gray-300"
            style={{ backgroundColor: color }}
            onClick={() =>
              document
                .querySelector<HTMLInputElement>("input[type=color]")
                ?.click()
            }
          />
        </div>
      </div>
      {/* Random color button */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleRandomColor}
      >
        Generate Random Color
      </Button>
    </>
  );
}
