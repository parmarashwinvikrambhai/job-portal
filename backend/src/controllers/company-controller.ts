import type { Request, Response } from "express";
import Company from "../models/company-model";
import { ZodError } from "zod";
import { companySchema, updateCompanySchema } from "../validators/company-validator";

export const registerCompany = async (req: Request, res: Response) => {
  try {
    const validateData = companySchema.safeParse(req.body);
    if (!validateData.success) {
      return res.status(400).json({
        message: validateData.error.issues[0]?.message || "Validation Error",
      });
    }

    const { name, description, website, location, industry, recruiterId } = validateData.data;
    
    // Check if company already exists
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res.status(400).json({ message: "Company already exists with this name" });
    }

    let logo = "";
    if (req.file) {
      logo = `/uploads/logos/${req.file.filename}`;
    }

    const company = await Company.create({
      name,
      description,
      website,
      location,
      industry,
      logo,
      recruiterId,
    });

    res.status(201).json({
      message: "Company registered successfully",
      company,
    });
  } catch (error) {
    console.error("Register Company Error:", error);
    return res.status(error instanceof ZodError ? 400 : 500).json({
      message:
        error instanceof ZodError
          ? error.issues[0]?.message
          : "Internal Server Error",
    });
  }
};

export const getCompanyByRecruiter = async (req: Request, res: Response) => {
  try {
    const { recruiterId } = req.params;
    if (typeof recruiterId !== "string") {
      return res.status(400).json({ message: "Invalid recruiter ID" });
    }
    const company = await Company.findOne({ recruiterId });
    
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ company });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Validate only provided fields
    const validateData = updateCompanySchema.safeParse(req.body);
    if (!validateData.success) {
       return res.status(400).json({
        message: validateData.error.issues[0]?.message || "Validation Error",
      });
    }

    const updateData: any = { ...validateData.data };

    if (req.file) {
      updateData.logo = `/uploads/logos/${req.file.filename}`;
    }

    const company = await Company.findByIdAndUpdate(id, updateData, { new: true });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({
      message: "Company updated successfully",
      company,
    });
  } catch (error) {
     return res.status(error instanceof ZodError ? 400 : 500).json({
      message:
        error instanceof ZodError
          ? error.issues[0]?.message
          : "Internal Server Error",
    });
  }
};
