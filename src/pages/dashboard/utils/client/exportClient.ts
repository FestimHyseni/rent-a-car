

import { IUser } from "@/models/User";

export function exportClientsToCSV(clients: IUser[]) {
  const headers = [
    "Emri", "Email", "Numri", "Shteti", "Qyteti", "Adresa", "Roli", "Data e Regjistrimit"
  ];

  const rows = clients.map(client => [
    client.name,
    client.email,
    client.number || "", 
    client.country || "",
    client.city || "",
    client.address || "",
    client.role,
    new Date(client.createdAt).toLocaleDateString()
  ]);

  const csvContent = [headers, ...rows]
    .map(e => e.map(val => `"${val}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "klientet.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
