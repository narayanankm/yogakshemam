import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfessionFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  nameEn: z.string().min(1, "Name in English is required"),
  nameMl: z.string().min(1, "Name in Malayalam is required"),
});

export function ProfessionForm({
  initialData,
  onSubmit,
  onCancel,
}: ProfessionFormProps) {
  const { t } = useLanguage();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameEn: initialData?.nameEn || "",
      nameMl: initialData?.nameMl || "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? t("profession.edit") : t("profession.create")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nameEn">{t("profession.nameEn")}</Label>
              <Input
                id="nameEn"
                {...register("nameEn")}
                error={errors.nameEn?.message}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameMl">{t("profession.nameMl")}</Label>
              <Input
                id="nameMl"
                {...register("nameMl")}
                error={errors.nameMl?.message}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("common.cancel")}
            </Button>
            <Button type="submit">
              {initialData ? t("common.save") : t("common.create")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
