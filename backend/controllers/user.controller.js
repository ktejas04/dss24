import User from '../models/user.models.js';
import validator from 'validator';

const registerUser = async (req, res) => {
    const { isTeam, name, email, phone, college, teamName, teamCollege, members, eventName } = req.body;

    try {
        // Validation for solo registration
        if (!isTeam && [name, email, college, phone].some(field => field === "")) {
            return res.json({
                success: false,
                message: "All fields are required for solo registration"
            });
        }

        // Validation for team registration
        if (isTeam) {
            if ([teamName, teamCollege].some(field => field === "")) {
                return res.json({
                    success: false,
                    message: "All fields are required for team registration"
                });
            }

            // Check if team name already exists
            const isTeamNameExisting = await User.findOne({ teamName });
            if (isTeamNameExisting) {
                return res.json({
                    success: false,
                    message: "Team name already exists. Please choose a different name."
                });
            }

            // Check if any member's email or phone number is already registered in another team
            const memberEmails = members.map(member => member.email).filter(email => email !== "");
            const memberPhones = members.map(member => member.phone);
            const isMemberExisting = await User.findOne({
                $or: [
                    { "members.email": { $in: memberEmails } },
                    { "members.phone": { $in: memberPhones } }
                ]
            });

            if (isMemberExisting) {
                return res.json({
                    success: false,
                    message: "Duplicate entries found for one or more team members."
                });
            }

            // Ensure all members have unique names, emails, and phone numbers within the same team
            const uniqueEmails = new Set(memberEmails);
            const uniquePhones = new Set(memberPhones);
            const memberNames = members.map(member => member.name);
            const uniqueNames = new Set(memberNames);

            if (uniqueEmails.size !== memberEmails.length || uniquePhones.size !== members.length || uniqueNames.size !== members.length) {
                return res.json({
                    success: false,
                    message: "All members must have unique names, emails, and phone numbers within the team."
                });
            }

            // Ensure all member phone numbers are 10 digits
            if (members.some(member => member.phone.length !== 10)) {
                return res.json({
                    success: false,
                    message: "All members' phone numbers should be 10 digits."
                });
            }
        }

        // Validation for solo email and phone
        if (!isTeam) {
            const isUserExisting = await User.findOne({ email });
            if (isUserExisting) {
                return res.json({
                    success: false,
                    message: "Email already exists. Please enter a different one."
                });
            }

            if (!validator.isEmail(email)) {
                return res.json({
                    success: false,
                    message: "Invalid Email"
                });
            }

            if (phone.length !== 10) {
                return res.json({
                    success: false,
                    message: "Phone number should be 10 digits."
                });
            }
        }

        // Create a new user or team object
        const user = new User({
            isTeam,
            name: isTeam ? undefined : name,
            phone: isTeam ? undefined : phone,
            email: isTeam ? undefined : email,
            college: isTeam ? undefined : college,
            teamName: isTeam ? teamName : undefined,
            teamCollege: isTeam ? teamCollege : undefined,
            members: isTeam ? members : [],
            eventName
        });

        // Only set the email field for solo registrations
        if (!isTeam) {
            user.email = email;
        }

        // Save the user or team
        await user.save();

        return res.json({
            success: true,
            message: isTeam ? "Team registered successfully" : "User registered successfully",
            user
        });

    } catch (error) {
        console.log("Error: ", error);
        return res.json({
            success: false,
            message: "Error: User/Team not registered",
            error: error.message
        });
    }
}

export { registerUser };
