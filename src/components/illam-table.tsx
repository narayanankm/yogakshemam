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

interface Gothram {
  id: number;
  nameEn: string;
  nameMl: string;
}

interface Vedam {
  id: number;
  nameEn: string;
  nameMl: string;
}

interface Gramam {
  id: number;
  nameEn: string;
  nameMl: string;
}

interface Illam {
  id: number;
  nameEn: string;
  nameMl: string;
  gothramId: number;
  gramamId: number;
  vedamId: number;
  phone?: string | null;
  address?: string | null;
  district?: string | null;
  state?: string | null;
  pincode?: string | null;
  mapsUrl?: string | null;
  gothram: Gothram;
  gramam: Gramam;
  vedam: Vedam;
}

interface IllamTableProps {
  illams: Illam[];
  onEdit: (illam: Illam) => void;
  onDelete: (id: number) => void;
}

export function IllamTable({ illams, onEdit, onDelete }: IllamTableProps) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("illam.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("illam.nameEn")}</TableHead>
                <TableHead>{t("illam.nameMl")}</TableHead>
                <TableHead>{t("illam.gothram")}</TableHead>
                <TableHead>{t("illam.gramam")}</TableHead>
                <TableHead>{t("illam.vedam")}</TableHead>
                <TableHead>{t("illam.phone")}</TableHead>
                <TableHead>{t("illam.district")}</TableHead>
                <TableHead className="text-right">
                  {t("common.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {illams.map((illam) => (
                <TableRow key={illam.id}>
                  <TableCell>{illam.nameEn}</TableCell>
                  <TableCell>{illam.nameMl}</TableCell>
                  <TableCell>
                    {illam.gothram.nameEn} ({illam.gothram.nameMl})
                  </TableCell>
                  <TableCell>
                    {illam.gramam.nameEn} ({illam.gramam.nameMl})
                  </TableCell>
                  <TableCell>
                    {illam.vedam.nameEn} ({illam.vedam.nameMl})
                  </TableCell>
                  <TableCell>{illam.phone || "-"}</TableCell>
                  <TableCell>{illam.district || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      className="mr-2"
                      onClick={() => onEdit(illam)}
                    >
                      {t("common.edit")}
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:text-red-900 hover:bg-red-50"
                      onClick={() => onDelete(illam.id)}
                    >
                      {t("common.delete")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {illams.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No illams found
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
