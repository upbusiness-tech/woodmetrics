export function onKeyDownNumberInput(
  event: React.KeyboardEvent<HTMLInputElement>,
) {
  if (event.key === "," || event.key === ".") {
    event.preventDefault();
  }
}

export function onChangeNumberInput(
  event: React.ChangeEvent<HTMLInputElement>,
) {
  const input = event.target.value.replace(/\D/g, ""); 
  if (input == "") return 0; 
  const numberValue = parseFloat(input) / 1000; 

  return numberValue;
}