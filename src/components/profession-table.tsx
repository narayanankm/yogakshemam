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

interface Profession {
  id: number;
  nameEn: string;
  nameMl: string;
}

interface ProfessionTableProps {
  professions: Profession[];
  onEdit: (profession: Profession) => void;
  onDelete: (id: number) => void;
}

export function ProfessionTable({
  professions,
  onEdit,
  onDelete,
}: ProfessionTableProps) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("profession.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("profession.nameEn")}</TableHead>
                <TableHead>{t("profession.nameMl")}</TableHead>
                <TableHead className="text-right">
                  {t("common.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professions.map((profession) => (
                <TableRow key={profession.id}>
                  <TableCell>{profession.nameEn}</TableCell>
                  <TableCell>{profession.nameMl}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      className="mr-2"
                      onClick={() => onEdit(profession)}
                    >
                      {t("common.edit")}
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:text-red-900 hover:bg-red-50"
                      onClick={() => onDelete(profession.id)}
                    >
                      {t("common.delete")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {professions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    {t("profession.noRecords")}
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
