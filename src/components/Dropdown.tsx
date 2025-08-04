import { useState, useEffect } from "react";
import Creatable from "react-select/creatable";
import "../App.css";
import supabase from "../utils/supabase";
import { formatUploadName } from "../utils/names";

type OptionType = { label: string; value: string };
const data = {
  clients: [] as OptionType[],
  creative: [] as OptionType[],
};

type DataKey = "clients" | "creative";

interface DropdownParams {
  onChange: (value: string) => void;
  type: DataKey;
}

const createOption = (label: string) => ({
  label,
  value: formatUploadName(label),
});
interface DropdownParams {
  onChange: (value: string) => void;
  type: DataKey;
  client?: string;
}
function Dropdown({ onChange, type, client }: DropdownParams) {
  const [options, setOptions] = useState(data[type]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (type === "creative") {
        //filter by client, or error if not provided
        if (!client) {
          setOptions([]);
          return;
        } else {
          console.log("Fetching creative options for client:", client);
          const { data: fetchedData, error } = await supabase
            .from(type)
            .select()
            .eq("client", client);
          if (error) {
            console.error("Error fetching creative options:", error);
            return;
          }
          if (fetchedData) {
            console.log("Fetched creative options:", fetchedData);
            const formattedOptions = fetchedData.map((item) => ({
              label: item.label,
              value: item.value,
            }));
            setOptions(formattedOptions);
          }
          return;
        }
      }

      const { data: fetchedData, error } = await supabase.from(type).select();
      if (error) {
        return;
      }
      if (fetchedData) {
        const formattedOptions = fetchedData.map((item) => ({
          label: item.label,
          value: item.value,
        }));
        setOptions(formattedOptions);
      }
    };
    fetchData();
  }, [type, client]);

  const [selectedOption, setSelectedOption] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const handleChange = (option: { value: string; label: string } | null) => {
    setSelectedOption(option);
    if (option) {
      onChange(option.value);
    }
  };

  const handleCreate = async (inputValue: string) => {
    setIsLoading(true);
    const newOption = createOption(inputValue);
    const { error } = await supabase.from(type).insert(newOption);
    if (!error) {
      setOptions((prev) => [...prev, newOption]);
      setSelectedOption(newOption);
      onChange(newOption.value);
    }
    setIsLoading(false);
  };

  return (
    <Creatable
      value={selectedOption}
      onChange={handleChange}
      options={options}
      placeholder={`Select ${type}`}
      className="dropdown"
      classNamePrefix="react-select"
      isSearchable
      isClearable
      isLoading={isLoading}
      onCreateOption={handleCreate}
      styles={{
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected ? "#182cfd" : "#fff",
          color: state.isSelected ? "#fff" : "#000",
          cursor: "pointer",
        }),
      }}
    />
  );
}

export default Dropdown;
