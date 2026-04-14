import type {NextFunction, Request, Response} from "express";
import {services} from "../../../../packages/config/config";

export async function handleGetCatalog(req: Request, res: Response, next: NextFunction) {
    try {
        const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
        const response = await fetch(`${services.catalog}/catalog${query}`, {
            method: "GET"
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        next(error);
    }
}

export async function handleGetCatalogTop(req: Request, res: Response, next: NextFunction) {
    try {
        const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
        const response = await fetch(`${services.catalog}/catalog/top${query}`, {
            method: "GET"
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        next(error);
    }
}

export async function handleGetCatalogFiltered(req: Request, res: Response, next: NextFunction) {
    try {
        const path = req.path;
        const response = await fetch(`${services.catalog}/catalog${path}`, {
            method: "GET"
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        next(error);
    }
}

export async function handleGetAnimeById(req: Request, res: Response, next: NextFunction) {
    try {
        const response = await fetch(`${services.catalog}/catalog/anime/id/${req.params.animeId}`, {
            method: "GET"
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        next(error);
    }
}

export async function handleGetAnimeByName(req: Request, res: Response, next: NextFunction) {
    try {
        const response = await fetch(`${services.catalog}/catalog/anime/name/${req.params.q}`, {
            method: "GET"
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        next(error);
    }
}
