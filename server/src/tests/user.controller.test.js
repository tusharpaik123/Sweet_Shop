import { jest } from '@jest/globals';
import request from "supertest";

const mockFindOne = jest.fn();
const mockCreate = jest.fn();  
const mockFindById = jest.fn();
const mockSelect = jest.fn();
const mockSave = jest.fn();




jest.unstable_mockModule("../models/user.model.js", () => ({
  User: {
    findOne: mockFindOne,
    create: mockCreate,  
    findById: mockFindById
  }
}));

jest.unstable_mockModule('mongoose', () => ({
  default: {
    connect: jest.fn().mockResolvedValue({}),
    connection: { host: 'test-host' },
  }
}));

const { app } = await import("../app.js");
describe("User Controller Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    
    it("should register a new user successfully", async () => {
        const mockUser = {
           _id: "123",
            name: "John",
            email: "john@example.com",
            password: "hashedPassword"
        };

        const mockCreatedUser = {
            _id: "123",
            name: "John",
            email: "john@example.com"
        };

        
         mockFindOne.mockResolvedValue(null);
        mockCreate.mockResolvedValue(mockUser);
        mockFindById.mockReturnValue({
         select: mockSelect.mockResolvedValue(mockCreatedUser)
        });


        const res = await request(app)
            .post("/api/v1/users/register")
            .send({
                name: "John",
                email: "john@example.com",
                password: "123456"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("User Registered Successfully");
        expect(res.body.data._id).toBe("123");
        expect(res.body.data.name).toBe("John");
        expect(res.body.data.email).toBe("john@example.com");

        
        expect(mockFindOne).toHaveBeenCalledWith({ email: "john@example.com" });
        expect(mockCreate).toHaveBeenCalledWith({
            name: "John",
            email: "john@example.com",
            password: "123456"
        });
        expect(mockFindById).toHaveBeenCalledWith("123");
       
        expect(mockSelect).toHaveBeenCalledWith("-passowrd -refreshToken");
    }, 10000);

   
    it("should login a user successfully", async () => {
        const mockUser = {
            _id: "123",
            email: "john@example.com",
            refreshToken: null,
            isPasswordCorrect: jest.fn().mockResolvedValue(true),
            generateAccessToken: jest.fn().mockReturnValue("mock-access-token"),
            generateRefreshToken: jest.fn().mockReturnValue("mock-refresh-token"),
            save: mockSave.mockResolvedValue(true)
        };

        const mockLoggedInUser = {
            _id: "123",
            name: "John",
            email: "john@example.com"
        };




       
        mockFindOne.mockResolvedValue(mockUser);
        
        
        mockFindById
            .mockResolvedValueOnce(mockUser)
            .mockReturnValueOnce({ 
                select: mockSelect.mockResolvedValue(mockLoggedInUser)
            });



        const res = await request(app)
            .post("/api/v1/users/login")
            .send({ 
                email: "john@example.com", 
                password: "123456" 
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("User logged in successfully");
        expect(res.body.data.user._id).toBe("123");
        expect(res.body.data.user.name).toBe("John");
        expect(res.body.data.user.email).toBe("john@example.com");
        expect(res.body.data.accessToken).toBe("mock-access-token");
        expect(res.body.data.refreshToken).toBe("mock-refresh-token");

       
        const cookies = res.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(cookies.some(cookie => cookie.includes('accessToken=mock-access-token'))).toBe(true);
        expect(cookies.some(cookie => cookie.includes('refreshToken=mock-refresh-token'))).toBe(true);

       
        expect(mockFindOne).toHaveBeenCalledWith({ email: "john@example.com" });
        expect(mockUser.isPasswordCorrect).toHaveBeenCalledWith("123456");
        expect(mockUser.generateAccessToken).toHaveBeenCalled();
        expect(mockUser.generateRefreshToken).toHaveBeenCalled();
        expect(mockSave).toHaveBeenCalledWith({ validateBeforeSave: false });
        expect(mockSelect).toHaveBeenCalledWith("-password -refreshToken");
    }, 10000);
});