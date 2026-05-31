const fs = require('fs');
let content = fs.readFileSync('d:/portfolio/backend/controller/project.ts', 'utf8');

const updateTarget = `export const updateProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, techStack, topBannerImg, description, shortSummary, image, github, live } = req.body;

        const updated = await projectsSchema.findByIdAndUpdate(
            id,
            { title, techStack, topBannerImg, description, shortSummary, image, github, live },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json(ApiResponse(false, "Project not found"));
        }

        return res.status(200).json(ApiResponse(true, "Project updated successfully", updated));
    } catch (error) {`;

const updateReplacement = `export const updateProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, techStack, topBannerImg, description, shortSummary, image, github, live } = req.body;

        const existingProject = await projectsSchema.findById(id);
        if (!existingProject) {
            return res.status(404).json(ApiResponse(false, "Project not found"));
        }

        // Compare images to find deleted ones
        const oldImageIds = new Set();
        if (existingProject.topBannerImg && (existingProject.topBannerImg as any).public_id) {
            oldImageIds.add((existingProject.topBannerImg as any).public_id);
        }
        if (existingProject.image && Array.isArray(existingProject.image)) {
            for (const img of existingProject.image) {
                if ((img as any).public_id) {
                    oldImageIds.add((img as any).public_id);
                }
            }
        }

        const newImageIds = new Set();
        if (topBannerImg && topBannerImg.public_id) {
            newImageIds.add(topBannerImg.public_id);
        }
        if (image && Array.isArray(image)) {
            for (const img of image) {
                if (img.public_id) {
                    newImageIds.add(img.public_id);
                }
            }
        }

        // Delete from Cloudinary
        for (const oldId of oldImageIds) {
            if (!newImageIds.has(oldId)) {
                try {
                    await cloudinary.uploader.destroy(oldId as string);
                } catch (e) {
                    console.error("Failed to delete from Cloudinary", e);
                }
            }
        }

        const updated = await projectsSchema.findByIdAndUpdate(
            id,
            { title, techStack, topBannerImg, description, shortSummary, image, github, live },
            { new: true }
        );

        return res.status(200).json(ApiResponse(true, "Project updated successfully", updated));
    } catch (error) {`;

content = content.replace(updateTarget, updateReplacement);
fs.writeFileSync('d:/portfolio/backend/controller/project.ts', content);
console.log("Updated controller/project.ts");
