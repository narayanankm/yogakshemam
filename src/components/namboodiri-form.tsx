import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface Option {
  id: number;
  nameEn: string;
  nameMl: string;
}

interface NamboodiriFormProps {
  initialData?: any;
  gothrams: Option[];
  illams: Option[];
  professions: Option[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  nameEn: z.string().min(1, "Name in English is required"),
  nameMl: z.string().min(1, "Name in Malayalam is required"),
  gothramId: z.string().min(1, "Gothram is required"),
  illamId: z.string().min(1, "Illam is required"),
  professionId: z.string().min(1, "Profession is required"),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
});

export function NamboodiriForm({
  initialData,
  gothrams,
  illams,
  professions,
  onSubmit,
  onCancel,
}: NamboodiriFormProps) {
  const { t } = useLanguage();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameEn: initialData?.nameEn || "",
      nameMl: initialData?.nameMl || "",
      gothramId: initialData?.gothramId?.toString() || "",
      illamId: initialData?.illamId?.toString() || "",
      professionId: initialData?.professionId?.toString() || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      address: initialData?.address || "",
      district: initialData?.district || "",
      state: initialData?.state || "",
      pincode: initialData?.pincode || "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? t("namboodiri.edit") : t("namboodiri.create")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nameEn">{t("namboodiri.nameEn")}</Label>
              <Input
                id="nameEn"
                {...register("nameEn")}
                error={errors.nameEn?.message}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameMl">{t("namboodiri.nameMl")}</Label>
              <Input
                id="nameMl"
                {...register("nameMl")}
                error={errors.nameMl?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gothramId">{t("namboodiri.gothram")}</Label>
              <Select
                onValueChange={(value) => setValue("gothramId", value)}
                defaultValue={initialData?.gothramId?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("namboodiri.selectGothram")} />
                </SelectTrigger>
                <SelectContent>
                  {gothrams.map((gothram) => (
                    <SelectItem key={gothram.id} value={gothram.id.toString()}>
                      {gothram.nameEn} ({gothram.nameMl})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gothramId && (
                <p className="text-sm text-red-500">
                  {errors.gothramId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="illamId">{t("namboodiri.illam")}</Label>
              <Select
                onValueChange={(value) => setValue("illamId", value)}
                defaultValue={initialData?.illamId?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("namboodiri.selectIllam")} />
                </SelectTrigger>
                <SelectContent>
                  {illams.map((illam) => (
                    <SelectItem key={illam.id} value={illam.id.toString()}>
                      {illam.nameEn} ({illam.nameMl})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.illamId && (
                <p className="text-sm text-red-500">{errors.illamId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionId">{t("namboodiri.profession")}</Label>
              <Select
                onValueChange={(value) => setValue("professionId", value)}
                defaultValue={initialData?.professionId?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("namboodiri.selectProfession")} />
                </SelectTrigger>
                <SelectContent>
                  {professions.map((profession) => (
                    <SelectItem
                      key={profession.id}
                      value={profession.id.toString()}
                    >
                      {profession.nameEn} ({profession.nameMl})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.professionId && (
                <p className="text-sm text-red-500">
                  {errors.professionId.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{t("namboodiri.phone")}</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("namboodiri.email")}</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t("namboodiri.address")}</Label>
            <Textarea id="address" {...register("address")} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="district">{t("namboodiri.district")}</Label>
              <Input id="district" {...register("district")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">{t("namboodiri.state")}</Label>
              <Input id="state" {...register("state")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">{t("namboodiri.pincode")}</Label>
              <Input id="pincode" {...register("pincode")} />
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
