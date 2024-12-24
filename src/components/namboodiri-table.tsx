import React from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Option {
  id: number;
  nameEn: string;
  nameMl: string;
}

interface Namboodiri {
  id: number;
  nameEn: string;
  nameMl: string;
  gothramId: number;
  illamId: number;
  professionId: number;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  district?: string | null;
  state?: string | null;
  pincode?: string | null;
  gothram: Option;
  illam: Option;
  profession: Option;
}

interface NamboodiriTableProps {
  namboodiris: Namboodiri[];
  onEdit: (namboodiri: Namboodiri) => void;
  onDelete: (id: number) => void;
}

export function NamboodiriTable({
  namboodiris,
  onEdit,
  onDelete,
}: NamboodiriTableProps) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("namboodiri.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("namboodiri.nameEn")}</TableHead>
                <TableHead>{t("namboodiri.nameMl")}</TableHead>
                <TableHead>{t("namboodiri.gothram")}</TableHead>
                <TableHead>{t("namboodiri.illam")}</TableHead>
                <TableHead>{t("namboodiri.profession")}</TableHead>
                <TableHead>{t("namboodiri.phone")}</TableHead>
                <TableHead>{t("namboodiri.email")}</TableHead>
                <TableHead className="text-right">
                  {t("common.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {namboodiris.map((namboodiri) => (
                <TableRow key={namboodiri.id}>
                  <TableCell>{namboodiri.nameEn}</TableCell>
                  <TableCell>{namboodiri.nameMl}</TableCell>
                  <TableCell>
                    {namboodiri.gothram.nameEn} ({namboodiri.gothram.nameMl})
                  </TableCell>
                  <TableCell>
                    {namboodiri.illam.nameEn} ({namboodiri.illam.nameMl})
                  </TableCell>
                  <TableCell>
                    {namboodiri.profession.nameEn} (
                    {namboodiri.profession.nameMl})
                  </TableCell>
                  <TableCell>{namboodiri.phone || "-"}</TableCell>
                  <TableCell>{namboodiri.email || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      className="mr-2"
                      onClick={() => onEdit(namboodiri)}
                    >
                      {t("common.edit")}
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:text-red-900 hover:bg-red-50"
                      onClick={() => onDelete(namboodiri.id)}
                    >
                      {t("common.delete")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {namboodiris.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    {t("namboodiri.noRecords")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
